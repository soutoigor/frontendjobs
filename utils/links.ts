import type { Socials } from '~/types/companies';

type SocialKind = keyof Socials;

const NETWORK_HOSTS: Partial<Record<SocialKind, string>> = {
	github: 'github.com',
	linkedin: 'linkedin.com',
	instagram: 'instagram.com',
};

function trimSlashes(value: string) {
	return value.replace(/^\/+|\/+$/g, '');
}

function hasProtocol(value: string) {
	return /^https?:\/\//i.test(value);
}

function asUrl(value: string) {
	return hasProtocol(value) ? value : `https://${value}`;
}

function readPathFromUrl(value: string) {
	try {
		const url = new URL(asUrl(value));
		return trimSlashes(url.pathname);
	}
	catch {
		return trimSlashes(value);
	}
}

function normalizeHandle(value: string) {
	return trimSlashes(value.trim().replace(/^@/, ''));
}

function normalizeNetworkLink(social: SocialKind, value: string) {
	const normalizedValue = normalizeHandle(value);
	const host = NETWORK_HOSTS[social];

	if (!host) {
		return normalizedValue;
	}

	const path = hasProtocol(normalizedValue) || normalizedValue.includes(host)
		? readPathFromUrl(normalizedValue)
		: normalizedValue;

	if (!path) {
		return '';
	}

	if (social === 'linkedin' && !path.startsWith('company/')) {
		return `https://www.linkedin.com/company/${path}`;
	}

	return `https://${host}/${path}`;
}

export function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizeExternalUrl(value: string) {
	const trimmedValue = value.trim();

	if (!trimmedValue) {
		return '';
	}

	return hasProtocol(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
}

export function normalizeApplicationDestination(value: string) {
	const trimmedValue = value.trim();

	if (!trimmedValue || isEmail(trimmedValue)) {
		return trimmedValue;
	}

	return normalizeExternalUrl(trimmedValue);
}

export function isValidApplicationDestination(value: string) {
	const normalizedValue = normalizeApplicationDestination(value);

	if (!normalizedValue) {
		return false;
	}

	if (isEmail(normalizedValue)) {
		return true;
	}

	try {
		new URL(normalizedValue);
		return true;
	}
	catch {
		return false;
	}
}

export function normalizeSocialLink(social: SocialKind, value?: string) {
	const trimmedValue = value?.trim() ?? '';

	if (!trimmedValue) {
		return '';
	}

	if (social === 'email') {
		return trimmedValue;
	}

	if (social === 'website') {
		return normalizeExternalUrl(trimmedValue);
	}

	return normalizeNetworkLink(social, trimmedValue);
}

export function getSocialHref(social: SocialKind, value: string) {
	const normalizedValue = normalizeSocialLink(social, value);

	if (social === 'email') {
		return `mailto:${normalizedValue}`;
	}

	return normalizedValue;
}

export function getApplicationHref(value: string) {
	const normalizedValue = normalizeApplicationDestination(value);

	if (isEmail(normalizedValue)) {
		return `mailto:${normalizedValue}`;
	}

	return normalizedValue;
}
