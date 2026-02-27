import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AppColors, AppFonts } from '@/constants/theme';
import { SectionLabel } from '@/components/SectionLabel';
import { EventCard } from '@/components/EventCard';
import { EventEmptyState } from '@/components/EventEmptyState';
import { EventModal } from '@/components/EventModal';
import { useEvents } from '@/contexts/EventContext';
import { splitEvents } from '@/utils/events';
import type { FiniteEvent } from '@/types';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FiniteEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { upcoming, past } = splitEvents(events);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const openNew = useCallback(() => {
    setEditingEvent(null);
    setModalVisible(true);
  }, []);

  const openEdit = useCallback((event: FiniteEvent) => {
    setEditingEvent(event);
    setModalVisible(true);
  }, []);

  const handleSave = useCallback((evt: Omit<FiniteEvent, 'id'> & { id?: number }) => {
    if (evt.id) {
      updateEvent(evt as FiniteEvent);
      setToast('Updated ✓');
    } else {
      addEvent(evt);
      setToast('Added ✓');
    }
    setModalVisible(false);
  }, [addEvent, updateEvent]);

  const handleDelete = useCallback((id: number) => {
    deleteEvent(id);
    setToast('Deleted ✓');
    setModalVisible(false);
  }, [deleteEvent]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sub-header */}
      <View style={styles.subHeader}>
        <View>
          <Text style={styles.subTitle}>📅 Events</Text>
          <Text style={styles.subCount}>
            {upcoming.length} upcoming • {past.length} past
          </Text>
        </View>
        <Pressable onPress={openNew} style={styles.addButton}>
          <LinearGradient
            colors={[AppColors.orange, AppColors.orangeLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addGradient}
          >
            <Text style={styles.addText}>+ Add</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {events.length === 0 ? (
          <EventEmptyState onAdd={openNew} />
        ) : (
          <>
            {upcoming.length > 0 && (
              <View style={styles.section}>
                <SectionLabel text="UPCOMING" />
                <View style={styles.cardList}>
                  {upcoming.map((e, i) => (
                    <EventCard key={e.id} event={e} index={i} onPress={() => openEdit(e)} />
                  ))}
                </View>
              </View>
            )}

            {past.length > 0 && (
              <View style={styles.section}>
                <SectionLabel text="PAST" />
                <View style={styles.cardList}>
                  {past.map((e, i) => (
                    <EventCard key={e.id} event={e} index={i} onPress={() => openEdit(e)} />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <EventModal
        visible={modalVisible}
        event={editingEvent}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setModalVisible(false)}
      />

      {/* Toast */}
      {toast && (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)} style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.surfaceBorder,
  },
  subTitle: {
    fontFamily: AppFonts.outfitBold,
    fontSize: 18,
    color: AppColors.text100,
  },
  subCount: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text25,
    marginTop: 2,
  },
  addButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  addGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 14,
    color: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
    gap: 10,
  },
  cardList: {
    gap: 8,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 99,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  toastText: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.green,
  },
});
