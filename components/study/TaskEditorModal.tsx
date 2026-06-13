import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors } from '@/constants/theme';
import type { TaskDraft } from '@/lib/study-planner';

const priorities: StudyTaskPriority[] = ['high', 'medium', 'low'];
const icons = ['📘', '📝', '🧠', '📊', '🎯', '💻', '📚', '✍️'];

const today = () => dayjs().format('YYYY-MM-DD');

type TaskEditorModalProps = {
  visible: boolean;
  courses: Course[];
  initialTask?: StudyTask | null;
  onClose: () => void;
  onSave: (draft: TaskDraft) => void;
};

export function TaskEditorModal({ visible, courses, initialTask, onClose, onSave }: TaskEditorModalProps) {
  const firstCourse = courses[0]?.title || 'General Study';

  const [title, setTitle] = useState('');
  const [course, setCourse] = useState(firstCourse);
  const [dueDate, setDueDate] = useState(today());
  const [dueTime, setDueTime] = useState('18:00');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [priority, setPriority] = useState<StudyTaskPriority>('medium');
  const [notes, setNotes] = useState('');
  const [icon, setIcon] = useState('📘');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setTitle(initialTask?.title || '');
    setCourse(initialTask?.course || firstCourse);
    setDueDate(initialTask?.dueDate || today());
    setDueTime(initialTask?.dueTime || '18:00');
    setDurationMinutes(String(initialTask?.durationMinutes || 45));
    setPriority(initialTask?.priority || 'medium');
    setNotes(initialTask?.notes || '');
    setIcon(initialTask?.icon || '📘');
    setError(null);
  }, [visible, initialTask, firstCourse]);

  const isEditMode = Boolean(initialTask);
  const durationNumber = useMemo(() => Number(durationMinutes.replace(/[^0-9]/g, '')), [durationMinutes]);

  const handleSave = () => {
    const safeTitle = title.trim();
    const safeDate = dueDate.trim();
    const safeTime = dueTime.trim();

    if (safeTitle.length < 3) {
      setError('Please enter a clear task title.');
      return;
    }

    const dateIsValid = /^\d{4}-\d{2}-\d{2}$/.test(safeDate) && dayjs(safeDate).isValid();

    if (!dateIsValid) {
      setError('Use date format YYYY-MM-DD.');
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(safeTime)) {
      setError('Use time format HH:mm, for example 18:30.');
      return;
    }

    if (!durationNumber || durationNumber < 15) {
      setError('Duration must be at least 15 minutes.');
      return;
    }

    onSave({
      title: safeTitle,
      course,
      dueDate: safeDate,
      dueTime: safeTime,
      durationMinutes: durationNumber,
      priority,
      notes,
      icon,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="px-5 pb-10 pt-5">
            <View className="mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-sans-extrabold text-primary">
                  {isEditMode ? 'Edit task' : 'New task'}
                </Text>
                <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                  Build a clear, focused study block.
                </Text>
              </View>
              <Pressable className="size-11 items-center justify-center rounded-2xl bg-card" onPress={onClose}>
                <Ionicons name="close-outline" size={26} color={colors.primary} />
              </Pressable>
            </View>

            {error ? (
              <View className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3">
                <Text className="text-sm font-sans-semibold text-destructive">{error}</Text>
              </View>
            ) : null}

            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Task title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Revise lecture 03 notes"
                  placeholderTextColor="rgba(15, 23, 42, 0.4)"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Subject</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {courses.map((item) => (
                      <Pressable
                        key={item.id}
                        className={`rounded-full px-4 py-3 ${course === item.title ? 'bg-accent' : 'bg-card'}`}
                        onPress={() => setCourse(item.title)}
                      >
                        <Text className={`text-sm font-sans-extrabold ${course === item.title ? 'text-white' : 'text-primary'}`}>
                          {item.title}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-sans-bold text-primary">Date</Text>
                  <TextInput
                    style={styles.input}
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(15, 23, 42, 0.4)"
                    autoCapitalize="none"
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-sans-bold text-primary">Time</Text>
                  <TextInput
                    style={styles.input}
                    value={dueTime}
                    onChangeText={setDueTime}
                    placeholder="18:00"
                    placeholderTextColor="rgba(15, 23, 42, 0.4)"
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Duration minutes</Text>
                <TextInput
                  style={styles.input}
                  value={durationMinutes}
                  onChangeText={(value) => setDurationMinutes(value.replace(/[^0-9]/g, '').slice(0, 3))}
                  placeholder="45"
                  placeholderTextColor="rgba(15, 23, 42, 0.4)"
                  keyboardType="number-pad"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Priority</Text>
                <View className="flex-row gap-2">
                  {priorities.map((item) => (
                    <Pressable
                      key={item}
                      className={`flex-1 rounded-2xl px-4 py-3 ${priority === item ? 'bg-accent' : 'bg-card'}`}
                      onPress={() => setPriority(item)}
                    >
                      <Text className={`text-center text-sm font-sans-extrabold capitalize ${priority === item ? 'text-white' : 'text-primary'}`}>
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Icon</Text>
                <View className="flex-row flex-wrap gap-2">
                  {icons.map((item) => (
                    <Pressable
                      key={item}
                      className={`size-12 items-center justify-center rounded-2xl ${icon === item ? 'bg-accent' : 'bg-card'}`}
                      onPress={() => setIcon(item)}
                    >
                      <Text className="text-2xl">{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Notes</Text>
                <TextInput
                  style={[styles.input, styles.notes]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add a small reminder or target..."
                  placeholderTextColor="rgba(15, 23, 42, 0.4)"
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            <Pressable className="mt-6 rounded-2xl bg-accent py-4" onPress={handleSave}>
              <Text className="text-center text-base font-sans-extrabold text-white">
                {isEditMode ? 'Save changes' : 'Add to planner'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'sans-medium',
  },
  notes: {
    minHeight: 110,
  },
});
