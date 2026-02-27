import { AppColors, AppFonts } from "@/constants/theme";
import type { FiniteEvent } from "@/types";
import { EVENT_COLORS, getDaysLeft, hexToRgba } from "@/utils/events";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
} from "react-native";

interface EventModalProps {
  visible: boolean;
  event: FiniteEvent | null; // null = new event
  onSave: (event: Omit<FiniteEvent, "id"> & { id?: number }) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export function EventModal({
  visible,
  event,
  onSave,
  onDelete,
  onClose,
}: EventModalProps) {
  const isNew = !event;
  const [name, setName] = useState(event?.name || "");
  const [due, setDue] = useState(event?.due || getDefaultDue());
  const [color, setColor] = useState(event?.color || EVENT_COLORS[0]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Reset state when modal opens with new data
  React.useEffect(() => {
    if (visible) {
      setName(event?.name || "");
      setDue(event?.due || getDefaultDue());
      setColor(event?.color || EVENT_COLORS[0]);
      setDeleteConfirm(false);
    }
  }, [visible, event]);

  const daysLeft = getDaysLeft(due);
  const canSave = name.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave({
      ...(event ? { id: event.id } : {}),
      name: name.trim(),
      due,
      color,
    });
  }

  function handleDelete() {
    if (event) {
      onDelete(event.id);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  {isNew ? "New Event" : "Edit Event"}
                </Text>
              </View>

              {/* Name input */}
              <View style={styles.field}>
                <Text style={styles.label}>EVENT NAME</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Project deadline, Birthday..."
                  placeholderTextColor={AppColors.text25}
                  style={styles.input}
                />
              </View>

              {/* Due date */}
              <View style={styles.field}>
                <Text style={styles.label}>DUE DATE</Text>
                <View style={styles.calendarContainer}>
                  <Calendar.List
                    calendarInitialMonthId={due}
                    calendarActiveDateRanges={[{ startId: due, endId: due }]}
                    calendarColorScheme="dark"
                    onCalendarDayPress={(dateId) => setDue(dateId)}
                    calendarMinDateId={toDateId(new Date())}
                    calendarPastScrollRangeInMonths={0}
                    calendarFutureScrollRangeInMonths={24}
                    theme={{
                      rowMonth: {
                        content: {
                          textAlign: "center",
                          color: "rgba(255,255,255,0.9)",
                          fontFamily: AppFonts.outfitSemiBold,
                          fontSize: 14,
                        },
                      },
                      itemWeekName: {
                        content: {
                          color: "rgba(255,255,255,0.4)",
                          fontFamily: AppFonts.mono,
                        },
                      },
                      itemDay: {
                        idle: () => ({
                          container: {},
                          content: {
                            color: "rgba(255,255,255,0.8)",
                            fontFamily: AppFonts.outfit,
                          },
                        }),
                        today: () => ({
                          container: {
                            borderColor: "rgba(255,255,255,0.3)",
                            borderWidth: 1,
                            borderRadius: 12,
                          },
                          content: {
                            color: "#fff",
                            fontFamily: AppFonts.outfitSemiBold,
                          },
                        }),
                        active: () => ({
                          container: {
                            backgroundColor: color,
                            borderRadius: 12,
                          },
                          content: {
                            color: "#fff",
                            fontFamily: AppFonts.outfitSemiBold,
                          },
                        }),
                      },
                    }}
                  />
                </View>
              </View>

              {/* Color picker */}
              <View style={styles.field}>
                <Text style={styles.label}>COLOR</Text>
                <View style={styles.colorRow}>
                  {EVENT_COLORS.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setColor(c)}
                      style={[
                        styles.colorDot,
                        {
                          backgroundColor: c,
                          borderColor: color === c ? "#fff" : "transparent",
                          transform: [{ scale: color === c ? 1.15 : 1 }],
                        },
                        color === c && {
                          shadowColor: c,
                          shadowOpacity: 0.6,
                          shadowRadius: 7,
                          shadowOffset: { width: 0, height: 0 },
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Preview */}
              {name.trim() !== "" && (
                <View
                  style={[
                    styles.preview,
                    {
                      backgroundColor: hexToRgba(color, 0.06),
                      borderColor: hexToRgba(color, 0.15),
                    },
                  ]}
                >
                  <Text style={[styles.previewDays, { color }]}>
                    {daysLeft}
                  </Text>
                  <View>
                    <Text style={styles.previewName}>{name}</Text>
                    <Text style={styles.previewSub}>
                      {daysLeft > 0
                        ? `${daysLeft} days left`
                        : daysLeft === 0
                          ? "today!"
                          : `${Math.abs(daysLeft)} days ago`}
                    </Text>
                  </View>
                </View>
              )}

              {/* Save button */}
              <Pressable
                onPress={handleSave}
                disabled={!canSave}
                style={styles.saveWrapper}
              >
                {canSave ? (
                  <LinearGradient
                    colors={[color, hexToRgba(color, 0.8)]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.saveGradient}
                  >
                    <Text style={styles.saveText}>
                      {isNew ? "+ Create Event" : "Save Changes"}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.saveDisabled}>
                    <Text style={styles.saveDisabledText}>
                      {isNew ? "+ Create Event" : "Save Changes"}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Delete — bottom of modal, inline confirmation */}
              {!isNew && (
                <View style={styles.deleteSection}>
                  {!deleteConfirm ? (
                    <Pressable onPress={() => setDeleteConfirm(true)}>
                      <Text style={styles.deleteLinkText}>
                        Delete this event
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={styles.deleteInlineRow}>
                      <Text style={styles.deleteInlineLabel}>
                        Are you sure?
                      </Text>
                      <Pressable
                        onPress={() => setDeleteConfirm(false)}
                        style={styles.cancelBtn}
                      >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleDelete}
                        style={styles.confirmDeleteBtn}
                      >
                        <Text style={styles.confirmDeleteBtnText}>Delete</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function getDefaultDue(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return formatDateString(d);
}

function formatDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1A1A22",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 99,
    backgroundColor: AppColors.text15,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 17,
    color: AppColors.text100,
  },
  deleteSection: {
    marginTop: 16,
    alignItems: "center",
  },
  deleteLinkText: {
    fontFamily: AppFonts.outfit,
    fontSize: 14,
    color: "#EF4444",
    paddingVertical: 8,
  },
  deleteInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deleteInlineLabel: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text60,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: AppColors.text06,
  },
  cancelBtnText: {
    fontFamily: AppFonts.outfit,
    fontSize: 12,
    color: AppColors.text35,
  },
  confirmDeleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EF4444",
  },
  confirmDeleteBtnText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 12,
    color: "#fff",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text25,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: AppColors.text06,
    borderWidth: 1,
    borderColor: AppColors.text10,
    color: AppColors.text100,
    fontFamily: AppFonts.outfit,
    fontSize: 15,
  },
  calendarContainer: {
    height: 300,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 8,
    overflow: "hidden",
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2.5,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  previewDays: {
    fontFamily: AppFonts.monoBold,
    fontSize: 20,
    fontWeight: "800",
  },
  previewName: {
    fontFamily: AppFonts.outfit,
    fontSize: 13,
    color: AppColors.text60,
  },
  previewSub: {
    fontFamily: AppFonts.mono,
    fontSize: 11,
    color: AppColors.text25,
  },
  saveWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  saveGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  saveText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 15,
    color: "#fff",
  },
  saveDisabled: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: AppColors.text06,
    borderRadius: 12,
  },
  saveDisabledText: {
    fontFamily: AppFonts.outfitSemiBold,
    fontSize: 15,
    color: AppColors.text20,
  },
});
