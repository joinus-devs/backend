export const ClubCreateDoc = {
  name: { type: "number" },
  description: { type: "string" },
  capacity: { type: "number" },
};

export const ClubUpdateDoc = {
  ...ClubCreateDoc,
};
