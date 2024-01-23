export const ClubDoc = {
  name: { type: "string" },
  description: { type: "string" },
  capacity: { type: "number" },
};

export const ClubDtoDoc = {
  name: { type: "string" },
  description: { type: "string" },
  capacity: { type: "number" },
};

export const ClubCreateDoc = {
  name: { type: "number" },
  description: { type: "string" },
  capacity: { type: "number" },
};

export const ClubUpdateDoc = {
  ...ClubCreateDoc,
};
