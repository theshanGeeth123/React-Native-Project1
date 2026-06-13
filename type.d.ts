declare global {
  type TabIconName = string;

  interface AppTab {
    name: string;
    title: string;
    icon: TabIconName;
  }

  interface TabIconProps {
    focused: boolean;
    icon: TabIconName;
  }

  type StudyTaskPriority = 'high' | 'medium' | 'low';
  type StudyTaskStatus = 'todo' | 'in-progress' | 'completed';

  interface StudyTask {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    dueTime: string;
    durationMinutes: number;
    priority: StudyTaskPriority;
    status: StudyTaskStatus;
    progress: number;
    color: string;
    icon: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
  }

  interface Course {
    id: string;
    code: string;
    title: string;
    lecturer: string;
    nextClass: string;
    color: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
  }

  interface FocusLog {
    id: string;
    date: string;
    minutes: number;
    note: string;
    createdAt: string;
  }

  interface StudyStat {
    id: string;
    label: string;
    value: string;
    caption: string;
    icon: string;
    color: string;
  }

  interface WeeklyFocus {
    day: string;
    date: string;
    minutes: number;
  }

  interface Achievement {
    id: string;
    title: string;
    caption: string;
    icon: string;
    unlocked: boolean;
  }

  interface ListHeadingProps {
    title: string;
    actionLabel?: string;
    onPress?: () => void;
  }
}

export {};
