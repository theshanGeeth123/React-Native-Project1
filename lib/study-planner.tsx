import { useUser } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { clampProgress, createId } from '@/lib/utils';

const STORAGE_PREFIX = 'bluestudy.local.v2';

export type TaskDraft = {
  title: string;
  course: string;
  dueDate: string;
  dueTime: string;
  durationMinutes: number;
  priority: StudyTaskPriority;
  notes?: string;
  icon?: string;
  color?: string;
};

export type CourseDraft = {
  code: string;
  title: string;
  lecturer: string;
  nextClass: string;
  icon?: string;
  color?: string;
};

type StudyPlannerState = {
  tasks: StudyTask[];
  courses: Course[];
  focusLogs: FocusLog[];
};

type StudyPlannerContextValue = StudyPlannerState & {
  isReady: boolean;
  todayKey: string;
  displayDate: string;
  todayTasks: StudyTask[];
  upcomingTasks: StudyTask[];
  completedTasks: StudyTask[];
  activeTasks: StudyTask[];
  overdueTasks: StudyTask[];
  weeklyFocus: WeeklyFocus[];
  stats: StudyStat[];
  achievements: Achievement[];
  overallCompletion: number;
  totalFocusMinutes: number;
  createTask: (draft: TaskDraft) => void;
  updateTask: (id: string, draft: Partial<TaskDraft>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  startTask: (id: string) => void;
  increaseTaskProgress: (id: string) => void;
  createCourse: (draft: CourseDraft) => void;
  deleteCourse: (id: string) => void;
  logFocus: (minutes: number, note?: string) => void;
  resetPlanner: () => void;
};

const StudyPlannerContext = createContext<StudyPlannerContextValue | undefined>(undefined);

const courseColors = ['#DBEAFE', '#CFFAFE', '#E0E7FF', '#BAE6FD', '#DDEBFF'];
const taskIcons = ['📘', '📝', '🧠', '📊', '🎯', '💻', '📚', '✍️'];

const nowIso = () => new Date().toISOString();

const makeCourse = (draft: CourseDraft, index = 0): Course => {
  const timestamp = nowIso();
  return {
    id: createId('course'),
    code: draft.code.trim() || 'NEW 101',
    title: draft.title.trim() || 'New Subject',
    lecturer: draft.lecturer.trim() || 'Self study',
    nextClass: draft.nextClass.trim() || 'Flexible',
    color: draft.color || courseColors[index % courseColors.length],
    icon: draft.icon || ['📘', '🧪', '💻', '📊', '🎓'][index % 5],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const makeTask = (draft: TaskDraft, index = 0): StudyTask => {
  const timestamp = nowIso();
  return {
    id: createId('task'),
    title: draft.title.trim() || 'Untitled study task',
    course: draft.course.trim() || 'General Study',
    dueDate: draft.dueDate || dayjs().format('YYYY-MM-DD'),
    dueTime: draft.dueTime || '18:00',
    durationMinutes: Math.max(15, Number(draft.durationMinutes) || 45),
    priority: draft.priority || 'medium',
    status: 'todo',
    progress: 0,
    color: draft.color || courseColors[index % courseColors.length],
    icon: draft.icon || taskIcons[index % taskIcons.length],
    notes: draft.notes?.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const createDefaultState = (): StudyPlannerState => {
  const today = dayjs();
  const courses: Course[] = [
    makeCourse(
      {
        code: 'MGT 301',
        title: 'Strategic Management',
        lecturer: 'Dr. Perera',
        nextClass: 'Mon, 9:30 AM',
        icon: '🎯',
        color: '#DBEAFE',
      },
      0,
    ),
    makeCourse(
      {
        code: 'MIS 3102',
        title: 'Management Information Systems',
        lecturer: 'Mr. Silva',
        nextClass: 'Wed, 11:00 AM',
        icon: '💻',
        color: '#CFFAFE',
      },
      1,
    ),
    makeCourse(
      {
        code: 'RES 4101',
        title: 'Research Project',
        lecturer: 'Supervisor meeting',
        nextClass: 'Fri, 2:30 PM',
        icon: '🔎',
        color: '#E0E7FF',
      },
      2,
    ),
  ];

  const tasks: StudyTask[] = [
    makeTask(
      {
        title: 'Summarize lecture notes and create flashcards',
        course: courses[0].title,
        dueDate: today.format('YYYY-MM-DD'),
        dueTime: '18:00',
        durationMinutes: 75,
        priority: 'high',
        notes: 'Focus on key frameworks and examples.',
        icon: '📚',
        color: '#DBEAFE',
      },
      0,
    ),
    makeTask(
      {
        title: 'Complete MIS past paper questions',
        course: courses[1].title,
        dueDate: today.add(1, 'day').format('YYYY-MM-DD'),
        dueTime: '20:00',
        durationMinutes: 90,
        priority: 'high',
        icon: '💻',
        color: '#CFFAFE',
      },
      1,
    ),
    makeTask(
      {
        title: 'Draft research questionnaire items',
        course: courses[2].title,
        dueDate: today.add(2, 'day').format('YYYY-MM-DD'),
        dueTime: '17:30',
        durationMinutes: 60,
        priority: 'medium',
        icon: '📝',
        color: '#E0E7FF',
      },
      2,
    ),
  ];

  tasks[0] = { ...tasks[0], status: 'in-progress', progress: 45 };

  const focusLogs: FocusLog[] = [
    {
      id: createId('focus'),
      date: today.subtract(2, 'day').format('YYYY-MM-DD'),
      minutes: 45,
      note: 'Reading block',
      createdAt: today.subtract(2, 'day').toISOString(),
    },
    {
      id: createId('focus'),
      date: today.subtract(1, 'day').format('YYYY-MM-DD'),
      minutes: 60,
      note: 'Past paper practice',
      createdAt: today.subtract(1, 'day').toISOString(),
    },
  ];

  return { courses, tasks, focusLogs };
};

const normalizeStoredState = (value: unknown): StudyPlannerState => {
  const fallback = createDefaultState();
  if (!value || typeof value !== 'object') return fallback;
  const record = value as Partial<StudyPlannerState>;
  return {
    courses: Array.isArray(record.courses) && record.courses.length ? record.courses : fallback.courses,
    tasks: Array.isArray(record.tasks) ? record.tasks : fallback.tasks,
    focusLogs: Array.isArray(record.focusLogs) ? record.focusLogs : fallback.focusLogs,
  };
};

const sortTasks = (tasks: StudyTask[]) =>
  [...tasks].sort((a, b) => {
    const aDate = dayjs(`${a.dueDate}T${a.dueTime || '09:00'}`).valueOf();
    const bDate = dayjs(`${b.dueDate}T${b.dueTime || '09:00'}`).valueOf();
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return aDate - bDate;
  });

export function StudyPlannerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userId = user?.id || 'guest';
  const storageKey = `${STORAGE_PREFIX}:${userId}`;

  const [state, setState] = useState<StudyPlannerState>(() => createDefaultState());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsReady(false);

    SecureStore.getItemAsync(storageKey)
      .then((stored) => {
        if (!mounted) return;
        if (!stored) {
          setState(createDefaultState());
          return;
        }
        setState(normalizeStoredState(JSON.parse(stored)));
      })
      .catch(() => {
        if (mounted) setState(createDefaultState());
      })
      .finally(() => {
        if (mounted) setIsReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!isReady) return;
    SecureStore.setItemAsync(storageKey, JSON.stringify(state)).catch(() => undefined);
  }, [isReady, state, storageKey]);

  const todayKey = dayjs().format('YYYY-MM-DD');

  const computed = useMemo(() => {
    const sorted = sortTasks(state.tasks);
    const todayTasks = sorted.filter((task) => task.dueDate === todayKey && task.status !== 'completed');
    const completedTasks = state.tasks.filter((task) => task.status === 'completed');
    const activeTasks = sorted.filter((task) => task.status !== 'completed');
    const upcomingTasks = sorted.filter((task) => task.dueDate >= todayKey && task.status !== 'completed');
    const overdueTasks = sorted.filter((task) => task.dueDate < todayKey && task.status !== 'completed');
    const completion = state.tasks.length
      ? Math.round((completedTasks.length / state.tasks.length) * 100)
      : 0;

    const weeklyFocus = Array.from({ length: 7 }).map((_, index) => {
      const date = dayjs().subtract(6 - index, 'day').format('YYYY-MM-DD');
      const logged = state.focusLogs
        .filter((log) => log.date === date)
        .reduce((sum, log) => sum + log.minutes, 0);
      const completedMinutes = completedTasks
        .filter((task) => task.completedAt && dayjs(task.completedAt).format('YYYY-MM-DD') === date)
        .reduce((sum, task) => sum + task.durationMinutes, 0);
      return {
        day: dayjs(date).format('ddd'),
        date,
        minutes: logged + completedMinutes,
      };
    });

    const totalFocusMinutes = weeklyFocus.reduce((sum, item) => sum + item.minutes, 0);
    const todayFocusMinutes = weeklyFocus.find((item) => item.date === todayKey)?.minutes || 0;
    const plannedTodayMinutes = todayTasks.reduce((sum, task) => sum + task.durationMinutes, 0);

    const stats: StudyStat[] = [
      {
        id: 'today',
        label: 'Today focus',
        value: `${Math.round(todayFocusMinutes / 60)}h ${todayFocusMinutes % 60}m`,
        caption: plannedTodayMinutes ? `${plannedTodayMinutes}m planned` : 'Add a study block',
        icon: 'time-outline',
        color: '#DBEAFE',
      },
      {
        id: 'active',
        label: 'Active tasks',
        value: String(activeTasks.length),
        caption: overdueTasks.length ? `${overdueTasks.length} overdue` : 'On schedule',
        icon: 'checkmark-done-circle-outline',
        color: '#CFFAFE',
      },
      {
        id: 'score',
        label: 'Completion',
        value: `${completion}%`,
        caption: `${completedTasks.length}/${state.tasks.length || 0} tasks done`,
        icon: 'trending-up-outline',
        color: '#E0E7FF',
      },
    ];

    const achievements: Achievement[] = [
      {
        id: 'starter',
        title: 'Planner Started',
        caption: 'Created your first study plan.',
        icon: 'rocket-outline',
        unlocked: state.tasks.length > 0,
      },
      {
        id: 'finisher',
        title: 'Task Finisher',
        caption: 'Complete 3 study tasks.',
        icon: 'trophy-outline',
        unlocked: completedTasks.length >= 3,
      },
      {
        id: 'deep-work',
        title: 'Deep Work Hour',
        caption: 'Log at least 60 focus minutes in one day.',
        icon: 'flame-outline',
        unlocked: weeklyFocus.some((item) => item.minutes >= 60),
      },
    ];

    return {
      sorted,
      todayTasks,
      upcomingTasks,
      completedTasks,
      activeTasks,
      overdueTasks,
      weeklyFocus,
      totalFocusMinutes,
      stats,
      achievements,
      overallCompletion: completion,
    };
  }, [state.tasks, state.focusLogs, todayKey]);

  const createTask = (draft: TaskDraft) => {
    setState((previous) => ({
      ...previous,
      tasks: sortTasks([...previous.tasks, makeTask(draft, previous.tasks.length)]),
    }));
  };

  const updateTask = (id: string, draft: Partial<TaskDraft>) => {
    setState((previous) => ({
      ...previous,
      tasks: sortTasks(
        previous.tasks.map((task) => {
          if (task.id !== id) return task;
          const progress = draft.priority ? task.progress : task.progress;
          return {
            ...task,
            ...draft,
            title: draft.title?.trim() || task.title,
            course: draft.course?.trim() || task.course,
            dueDate: draft.dueDate || task.dueDate,
            dueTime: draft.dueTime || task.dueTime,
            durationMinutes: draft.durationMinutes ? Math.max(15, Number(draft.durationMinutes)) : task.durationMinutes,
            progress,
            updatedAt: nowIso(),
          };
        }),
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setState((previous) => ({
      ...previous,
      tasks: previous.tasks.filter((task) => task.id !== id),
    }));
  };

  const toggleTaskComplete = (id: string) => {
    setState((previous) => ({
      ...previous,
      tasks: sortTasks(
        previous.tasks.map((task) => {
          if (task.id !== id) return task;
          const isCompleted = task.status === 'completed';
          return {
            ...task,
            status: isCompleted ? 'todo' : 'completed',
            progress: isCompleted ? 0 : 100,
            completedAt: isCompleted ? undefined : nowIso(),
            updatedAt: nowIso(),
          };
        }),
      ),
    }));
  };

  const startTask = (id: string) => {
    setState((previous) => ({
      ...previous,
      tasks: previous.tasks.map((task) =>
        task.id === id && task.status !== 'completed'
          ? { ...task, status: 'in-progress', progress: Math.max(task.progress, 25), updatedAt: nowIso() }
          : task,
      ),
    }));
  };

  const increaseTaskProgress = (id: string) => {
    setState((previous) => ({
      ...previous,
      tasks: sortTasks(
        previous.tasks.map((task) => {
          if (task.id !== id || task.status === 'completed') return task;
          const nextProgress = clampProgress(task.progress + 25);
          return {
            ...task,
            progress: nextProgress,
            status: nextProgress >= 100 ? 'completed' : 'in-progress',
            completedAt: nextProgress >= 100 ? nowIso() : task.completedAt,
            updatedAt: nowIso(),
          };
        }),
      ),
    }));
  };

  const createCourse = (draft: CourseDraft) => {
    setState((previous) => ({
      ...previous,
      courses: [...previous.courses, makeCourse(draft, previous.courses.length)],
    }));
  };

  const deleteCourse = (id: string) => {
    setState((previous) => {
      const course = previous.courses.find((item) => item.id === id);
      if (!course || previous.courses.length <= 1) return previous;
      return {
        ...previous,
        courses: previous.courses.filter((item) => item.id !== id),
        tasks: previous.tasks.map((task) =>
          task.course === course.title ? { ...task, course: 'General Study', updatedAt: nowIso() } : task,
        ),
      };
    });
  };

  const logFocus = (minutes: number, note = 'Manual focus session') => {
    const safeMinutes = Math.max(5, Math.round(minutes));
    setState((previous) => ({
      ...previous,
      focusLogs: [
        ...previous.focusLogs,
        {
          id: createId('focus'),
          date: todayKey,
          minutes: safeMinutes,
          note,
          createdAt: nowIso(),
        },
      ],
    }));
  };

  const resetPlanner = () => {
    setState(createDefaultState());
  };

  const value: StudyPlannerContextValue = {
    ...state,
    tasks: computed.sorted,
    isReady,
    todayKey,
    displayDate: dayjs().format('dddd, MMMM D'),
    todayTasks: computed.todayTasks,
    upcomingTasks: computed.upcomingTasks,
    completedTasks: computed.completedTasks,
    activeTasks: computed.activeTasks,
    overdueTasks: computed.overdueTasks,
    weeklyFocus: computed.weeklyFocus,
    stats: computed.stats,
    achievements: computed.achievements,
    overallCompletion: computed.overallCompletion,
    totalFocusMinutes: computed.totalFocusMinutes,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    startTask,
    increaseTaskProgress,
    createCourse,
    deleteCourse,
    logFocus,
    resetPlanner,
  };

  return <StudyPlannerContext.Provider value={value}>{children}</StudyPlannerContext.Provider>;
}

export function useStudyPlanner() {
  const value = useContext(StudyPlannerContext);
  if (!value) {
    throw new Error('useStudyPlanner must be used within StudyPlannerProvider');
  }
  return value;
}
