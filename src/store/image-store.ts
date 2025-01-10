import { create } from "zustand";

interface ImageState {
	image: string | null;
	editedImage: string | null;
	setImage: (image: string | null) => void;
	setEditedImage: (image: string | null) => void;
	reset: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
	image: null,
	editedImage: null,
	setImage: (image) => set({ image }),
	setEditedImage: (image) => set({ editedImage: image }),
	reset: () => set({ image: null, editedImage: null }),
}));
