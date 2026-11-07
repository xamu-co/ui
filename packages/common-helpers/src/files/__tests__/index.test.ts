// @vitest-environment jsdom
import { describe, it, expect } from "vitest";

import { eMimeType } from "@open-xamu-co/ui-common-enums";

import {
	fileMatchesMimeTypes,
	renameFile,
	jpegMimeType,
	pngMimeType,
	gifMimeTypeA,
	imageMimeTypes,
	mp3Id3MimeType,
	wavMimeType,
	mp4MimeType,
} from "../index";

describe("files helpers", () => {
	describe("fileMatchesMimeTypes", () => {
		it("should return eMimeType.IMAGE for a valid PNG header", async () => {
			const pngHeader = new Uint8Array([
				0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00,
			]);
			const file = new File([pngHeader], "test.png", { type: "image/png" });
			const result = await fileMatchesMimeTypes(file, [pngMimeType]);

			expect(result).toBe(eMimeType.IMAGE);
		});

		it("should return eMimeType.IMAGE for a valid JPEG header", async () => {
			const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
			const file = new File([jpegHeader], "test.jpg", { type: "image/jpeg" });
			const result = await fileMatchesMimeTypes(file, [jpegMimeType]);

			expect(result).toBe(eMimeType.IMAGE);
		});

		it("should return eMimeType.IMAGE for a valid GIF header", async () => {
			const gifHeader = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]);
			const file = new File([gifHeader], "test.gif", { type: "image/gif" });
			const result = await fileMatchesMimeTypes(file, [gifMimeTypeA]);

			expect(result).toBe(eMimeType.IMAGE);
		});

		it("should return eMimeType.AUDIO for a valid MP3 ID3 header", async () => {
			const mp3Header = new Uint8Array([0x49, 0x44, 0x33, 0x03, 0x00, 0x00]);
			const file = new File([mp3Header], "test.mp3", { type: "audio/mpeg" });
			const result = await fileMatchesMimeTypes(file, [mp3Id3MimeType]);

			expect(result).toBe(eMimeType.AUDIO);
		});

		it("should return eMimeType.AUDIO for a valid WAV header", async () => {
			const wavHeader = new Uint8Array([
				0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
			]);
			const file = new File([wavHeader], "test.wav", { type: "audio/wav" });
			const result = await fileMatchesMimeTypes(file, [wavMimeType]);

			expect(result).toBe(eMimeType.AUDIO);
		});

		it("should return eMimeType.VIDEO for a valid MP4 ftyp header", async () => {
			const mp4Header = new Uint8Array([
				0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
			]);
			const file = new File([mp4Header], "test.mp4", { type: "video/mp4" });
			const result = await fileMatchesMimeTypes(file, [mp4MimeType]);

			expect(result).toBe(eMimeType.VIDEO);
		});

		it("should return false for unrecognized/mismatched bytes", async () => {
			const randomBytes = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
			const file = new File([randomBytes], "unknown.bin", {
				type: "application/octet-stream",
			});
			const result = await fileMatchesMimeTypes(file, imageMimeTypes);

			expect(result).toBe(false);
		});

		it("should return false when mimeTypes array is empty", async () => {
			const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
			const file = new File([pngHeader], "test.png", { type: "image/png" });
			const result = await fileMatchesMimeTypes(file, []);

			expect(result).toBe(false);
		});

		it("should return false for an empty file (0 bytes)", async () => {
			const emptyFile = new File([], "empty.png", { type: "image/png" });
			const result = await fileMatchesMimeTypes(emptyFile, imageMimeTypes);

			expect(result).toBe(false);
		});

		it("should return false when file has fewer bytes than required pattern length", async () => {
			const tinyBytes = new Uint8Array([0x89, 0x50]); // only 2 bytes for PNG (requires 8)
			const tinyFile = new File([tinyBytes], "tiny.png", { type: "image/png" });
			const result = await fileMatchesMimeTypes(tinyFile, [pngMimeType]);

			expect(result).toBe(false);
		});
	});

	describe("renameFile", () => {
		it("should create a new File with the new name while preserving contents and metadata", () => {
			const content = new Uint8Array([1, 2, 3, 4]);
			const original = new File([content], "original.png", {
				type: "image/png",
				lastModified: 1700000000000,
			});

			const renamed = renameFile(original, "renamed_0.png");

			expect(renamed).toBeInstanceOf(File);
			expect(renamed.name).toBe("renamed_0.png");
			expect(renamed.type).toBe("image/png");
			expect(renamed.lastModified).toBe(1700000000000);
			expect(renamed.size).toBe(original.size);
		});
	});
});
