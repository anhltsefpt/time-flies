import { EventCard } from "@/components/EventCard";
import { EventEmptyState } from "@/components/EventEmptyState";
import { EventModal } from "@/components/EventModal";
import { AppColors, AppFonts } from "@/constants/theme";
import { useEvents } from "@/contexts/EventContext";
import type { FiniteEvent } from "@/types";
import { track } from "@/utils/analytics";
import { splitEvents } from "@/utils/events";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FiniteEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pastCollapsed, setPastCollapsed] = useState(true);

  const { upcoming, past } = useMemo(() => splitEvents(events), [events]);

  // If no upcoming events, show past expanded by default
  useEffect(() => {
    if (upcoming.length === 0 && past.length > 0) {
      setPastCollapsed(false);
    }
  }, [upcoming.length, past.length]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const openNew = useCallback((source: 'header' | 'empty_state') => {
    track('event_add_pressed', { source });
    setEditingEvent(null);
    setModalVisible(true);
  }, []);

  const openEdit = useCallback((event: FiniteEvent, isPast: boolean) => {
    track('event_card_pressed', { id: event.id, is_past: isPast });
    setEditingEvent(event);
    setModalVisible(true);
  }, []);

  const handleSave = useCallback(
    (evt: Omit<FiniteEvent, "id"> & { id?: number }) => {
      if (evt.id) {
        updateEvent(evt as FiniteEvent);
        setToast("Updated");
      } else {
        track('event_creation_completed', { color: evt.color });
        addEvent(evt);
        setToast("Added");
      }
      setModalVisible(false);
    },
    [addEvent, updateEvent],
  );

  const handleDelete = useCallback(
    (id: number) => {
      deleteEvent(id);
      setToast("Deleted");
      setModalVisible(false);
    },
    [deleteEvent],
  );

  const handleSwipeDelete = useCallback(
    (id: number) => {
      track('event_swiped_delete', { id });
      deleteEvent(id);
      setToast("Deleted");
    },
    [deleteEvent],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => openNew('header')} style={styles.addButton}>
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
          <EventEmptyState onAdd={() => openNew('empty_state')} />
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(200).duration(500)}
                style={styles.section}
              >
                <Text style={styles.sectionLabel}>UPCOMING</Text>
                <View style={styles.cardList}>
                  {upcoming.map((e, i) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      index={i}
                      onPress={() => openEdit(e, false)}
                      onDelete={handleSwipeDelete}
                    />
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Divider + Past section */}
            {past.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(400).duration(500)}
                style={styles.pastSection}
              >
                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>completed</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Collapsible header */}
                <Pressable
                  onPress={() => {
                    const next = !pastCollapsed;
                    track('past_events_toggled', { collapsed: next, past_count: past.length });
                    setPastCollapsed(next);
                  }}
                  style={styles.pastHeader}
                >
                  <Text style={styles.sectionLabel}>PAST ({past.length})</Text>
                  <Text style={styles.collapseIcon}>
                    {pastCollapsed ? "▸" : "▾"}
                  </Text>
                </Pressable>

                {/* Past cards */}
                {!pastCollapsed && (
                  <View style={styles.cardList}>
                    {past.map((e, i) => (
                      <EventCard
                        key={e.id}
                        event={e}
                        index={i}
                        onPress={() => openEdit(e, true)}
                      />
                    ))}
                  </View>
                )}
              </Animated.View>
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
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.toast}
        >
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  addGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 14,
    color: "#fff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text35,
    letterSpacing: 1.5,
  },
  cardList: {
    gap: 8,
  },
  pastSection: {
    gap: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.text08,
  },
  dividerText: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text20,
  },
  pastHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  collapseIcon: {
    fontSize: 14,
    color: AppColors.text25,
  },
  toast: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 99,
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  toastText: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.green,
  },
});
