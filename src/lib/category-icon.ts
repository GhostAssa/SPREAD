const CATEGORY_ICON: Record<string, string> = {
  Life: "local_fire_department",
  Tech: "bolt",
  Facilities: "construction",
  Academics: "school",
  "Campus Politics": "campaign",
  Admin: "gavel",
  Fees: "payments",
};

export function categoryIcon(category: string): string {
  return CATEGORY_ICON[category] ?? "campaign";
}
