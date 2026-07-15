type Classification = {
  changeType: string;
  severity: "low" | "medium" | "high";
  label: string;
};

const highSeverityRules: Array<[RegExp, Classification]> = [
  [/cancel|cancellation/i, { changeType: "parade_cancellation", severity: "high", label: "CANCELLATION" }],
  [/postpone|postponed/i, { changeType: "parade_postponement", severity: "high", label: "TIME CHANGE" }],
  [/route/i, { changeType: "route_change", severity: "high", label: "ROUTE CHANGE" }],
  [/road closure|street closure|traffic/i, { changeType: "road_closure_change", severity: "high", label: "ROAD CLOSURE" }],
  [/tow|towed|parking/i, { changeType: "parking_change", severity: "high", label: "TOWING / PARKING CHANGE" }]
];

const mediumSeverityRules: Array<[RegExp, Classification]> = [
  [/safety|public safety|barricade/i, { changeType: "safety_update", severity: "medium", label: "PUBLIC SAFETY UPDATE" }],
  [/vendor/i, { changeType: "vendor_update", severity: "medium", label: "VENDOR POLICY UPDATE" }],
  [/horse/i, { changeType: "horse_policy_update", severity: "medium", label: "HORSE POLICY UPDATE" }],
  [/litter|cleanup/i, { changeType: "litter_cleanup_update", severity: "medium", label: "PUBLIC SAFETY UPDATE" }],
  [/pdf|map/i, { changeType: "new_pdf_or_map", severity: "medium", label: "NEW RESOURCE" }]
];

export function classifyContentChange(text: string): Classification {
  const match =
    highSeverityRules.find(([pattern]) => pattern.test(text)) ??
    mediumSeverityRules.find(([pattern]) => pattern.test(text));

  if (match) {
    return match[1];
  }

  return {
    changeType: "minor_text_change",
    severity: "low",
    label: "NEW RESOURCE"
  };
}

