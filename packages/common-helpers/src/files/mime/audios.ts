import type { iMime } from "@open-xamu-co/ui-common-types";
import { eMimeType } from "@open-xamu-co/ui-common-enums";

/** MP3 — ID3 tag variant (ID3v2) */
export const mp3Id3MimeType: iMime = {
	mime: "audio/mpeg",
	pattern: [0x49, 0x44, 0x33], // 'ID3'
	mask: [0xff, 0xff, 0xff],
	type: eMimeType.AUDIO,
};

/** MP3 — raw MPEG frame sync variant (no ID3 tag) */
export const mp3SyncMimeType: iMime = {
	mime: "audio/mpeg",
	pattern: [0xff, 0xfb], // MPEG sync word + Layer III
	mask: [0xff, 0xff],
	type: eMimeType.AUDIO,
};

/** WAV (RIFF/WAVE)
 * Uses RIFF header + WAVE signature
 * Bytes 4-7 are the file size (ignored via 0x00 mask)
 */
export const wavMimeType: iMime = {
	mime: "audio/wav",
	pattern: [
		...[0x52, 0x49, 0x46, 0x46], // 'RIFF'
		...[0x00, 0x00, 0x00, 0x00], // file size (ignored)
		...[0x57, 0x41, 0x56, 0x45], // 'WAVE'
	],
	mask: [
		...[0xff, 0xff, 0xff, 0xff], // RIFF
		...[0x00, 0x00, 0x00, 0x00], // file size (ignored)
		...[0xff, 0xff, 0xff, 0xff], // WAVE
	],
	type: eMimeType.AUDIO,
};

/** OGG Vorbis / Opus */
export const oggAudioMimeType: iMime = {
	mime: "audio/ogg",
	pattern: [0x4f, 0x67, 0x67, 0x53, 0x00], // 'OggS'
	mask: [0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.AUDIO,
};

/** FLAC */
export const flacMimeType: iMime = {
	mime: "audio/flac",
	pattern: [0x66, 0x4c, 0x61, 0x43], // 'fLaC'
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.AUDIO,
};

/** AAC — ADTS variant */
export const aacMimeType: iMime = {
	mime: "audio/aac",
	pattern: [0xff, 0xf1], // ADTS sync word (MPEG-4 AAC)
	mask: [0xff, 0xf6],
	type: eMimeType.AUDIO,
};

/** M4A (AAC in MPEG-4 container)
 * Uses ftyp box with 'M4A ' brand
 */
export const m4aMimeType: iMime = {
	mime: "audio/mp4",
	pattern: [
		...[0x00, 0x00, 0x00, 0x00], // box size (ignored)
		...[0x66, 0x74, 0x79, 0x70], // 'ftyp'
		...[0x4d, 0x34, 0x41], // 'M4A '
	],
	mask: [
		...[0x00, 0x00, 0x00, 0x00], // box size (ignored)
		...[0xff, 0xff, 0xff, 0xff], // 'ftyp'
		...[0xff, 0xff, 0xff], // 'M4A '
	],
	type: eMimeType.AUDIO,
};

/** WebM Audio (audio/webm)
 * Uses EBML header + DocType 'webm'
 * Bytes 4-9 are variable EBML fields (size, versions), ignored via 0x00 mask
 */
export const webmAudioMimeType: iMime = {
	mime: "audio/webm",
	pattern: [
		...[0x1a, 0x45, 0xdf, 0xa3], // EBML magic
		...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // variable EBML fields (ignored)
		...[0x77, 0x65, 0x62, 0x6d], // DocType: 'webm'
	],
	mask: [
		...[0xff, 0xff, 0xff, 0xff], // EBML magic
		...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // variable fields (ignored)
		...[0xff, 0xff, 0xff, 0xff], // DocType
	],
	type: eMimeType.AUDIO,
};

/** Windows Media Audio / WMA */
export const wmaMimeType: iMime = {
	mime: "audio/x-ms-wma",
	pattern: [0x30, 0x26, 0xb2, 0x75], // ASF header (shared with WMV)
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.AUDIO,
};

/** AIFF */
export const aiffMimeType: iMime = {
	mime: "audio/aiff",
	pattern: [
		...[0x46, 0x4f, 0x52, 0x4d], // 'FORM'
		...[0x00, 0x00, 0x00, 0x00], // file size (ignored)
		...[0x41, 0x49, 0x46, 0x46], // 'AIFF'
	],
	mask: [
		...[0xff, 0xff, 0xff, 0xff], // FORM
		...[0x00, 0x00, 0x00, 0x00], // file size (ignored)
		...[0xff, 0xff, 0xff, 0xff], // AIFF
	],
	type: eMimeType.AUDIO,
};

/** MIDI */
export const midiMimeType: iMime = {
	mime: "audio/midi",
	pattern: [0x4d, 0x54, 0x68, 0x64], // 'MThd'
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.AUDIO,
};

/**
 * Standard audio mime types array (MP3, WAV, AAC)
 */
export const standardAudioMimeTypes: iMime[] = [
	mp3Id3MimeType,
	mp3SyncMimeType,
	wavMimeType,
	aacMimeType,
];

/**
 * Lossless audio mime types array
 */
export const losslessAudioMimeTypes: iMime[] = [wavMimeType, flacMimeType, aiffMimeType];

/**
 * All supported audio mime types array
 */
export const audioMimeTypes: iMime[] = [
	...standardAudioMimeTypes,
	flacMimeType,
	m4aMimeType,
	oggAudioMimeType,
	webmAudioMimeType,
	wmaMimeType,
	aiffMimeType,
	midiMimeType,
];
