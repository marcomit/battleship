import { FriendRequest } from "@prisma/client";
import { create } from "zustand";

type UseRequest = {
  requestReceived: FriendRequest[];
  requestSent: FriendRequest[];
  addReceivedRequest: (request: FriendRequest) => void;
  addSentRequest: (request: FriendRequest) => void;
  removeRequest: (id: string) => void;
};

export const useRequest = create<UseRequest>()((set) => ({
  requestReceived: [],
  requestSent: [],
  addReceivedRequest(request) {},
  addSentRequest(request) {},
  removeRequest(id) {},
}));
