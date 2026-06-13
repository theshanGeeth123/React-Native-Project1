import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
import type { CourseDraft } from '@/lib/study-planner';

const icons = ['📘', '🧪', '💻', '📊', '🎓', '🧠', '🔎', '✍️'];
const swatches = ['#DBEAFE', '#CFFAFE', '#E0E7FF', '#BAE6FD', '#DDEBFF'];

type CourseEditorModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (draft: CourseDraft) => void;
};

export function CourseEditorModal({ visible, onClose, onSave }: CourseEditorModalProps) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [nextClass, setNextClass] = useState('');
  const [icon, setIcon] = useState('📘');
  const [color, setColor] = useState(swatches[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setCode('');
    setTitle('');
    setLecturer('');
    setNextClass('');
    setIcon('📘');
    setColor(swatches[0]);
    setError(null);
  }, [visible]);

  const handleSave = () => {
    if (title.trim().length < 3) {
      setError('Please enter the subject name.');
      return;
    }

    onSave({
      code,
      title,
      lecturer,
      nextClass,
      icon,
      color,
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
                <Text className="text-3xl font-sans-extrabold text-primary">New subject</Text>
                <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                  Group your study tasks by module.
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
                <Text className="text-sm font-sans-bold text-primary">Subject name</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Financial Accounting"
                  placeholderTextColor="rgba(15, 23, 42, 0.4)"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Subject code</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={setCode}
                  placeholder="e.g. ACC 301"
                  placeholderTextColor="rgba(15, 23, 42, 0.4)"
                  autoCapitalize="characters"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Lecturer / note</Text>
                <TextInput
                  style={styles.input}
                  value={lecturer}
                  onChangeText={setLecturer}
                  placeholder="e.g. Dr. Fernando"
                  placeholderTextColor="rgba(15, 23, 42, 0.4)"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-sans-bold text-primary">Next class</Text>
                <TextInput
                  style={styles.input}
                  value={nextClass}
                  onChangeText={setNextClass}
                  placeholder="e.g. Thu, 10:00 AM"
                  placeholderTextColor="rgba(15, 23, 42, 0.4)"
                />
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
                <Text className="text-sm font-sans-bold text-primary">Color</Text>
                <View className="flex-row gap-3">
                  {swatches.map((item) => (
                    <Pressable
                      key={item}
                      className="size-12 items-center justify-center rounded-2xl border border-border"
                      style={{ backgroundColor: item }}
                      onPress={() => setColor(item)}
                    >
                      {color === item ? <Ionicons name="checkmark" size={22} color={colors.primary} /> : null}
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <Pressable className="mt-6 rounded-2xl bg-accent py-4" onPress={handleSave}>
              <Text className="text-center text-base font-sans-extrabold text-white">Create subject</Text>
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
});
