declare module BitBucketResponse {
	export interface Watchers {
		href: string;
	}
	export interface Branches {
		href: string;
	}
	export interface Tags {
		href: string;
	}
	export interface Commits {
		href: string;
	}
	export interface Clone {
		href: string;
		name: string;
	}
	export interface Self {
		href: string;
	}
	export interface Source {
		href: string;
	}

	export interface Html {
		href: string;
	}

	export interface Avatar {
		href: string;
	}

	export interface Hooks {
		href: string;
	}

	export interface Forks {
		href: string;
	}

	export interface Downloads {
		href: string;
	}

	export interface Pullrequests {
		href: string;
	}

	export interface Links {
		watchers: Watchers;
		branches: Branches;
		tags: Tags;
		commits: Commits;
		clone: Clone[];
		self: Self;
		source: Source;
		html: Html;
		avatar: Avatar;
		hooks: Hooks;
		forks: Forks;
		downloads: Downloads;
		pullrequests: Pullrequests;
	}

	export interface Self2 {
		href: string;
	}

	export interface Html2 {
		href: string;
	}

	export interface Avatar2 {
		href: string;
	}

	export interface Links2 {
		self: Self2;
		html: Html2;
		avatar: Avatar2;
	}

	export interface Project {
		links: Links2;
		type: string;
		name: string;
		key: string;
		uuid: string;
	}

	export interface Mainbranch {
		type: string;
		name: string;
	}

	export interface Self3 {
		href: string;
	}

	export interface Html3 {
		href: string;
	}

	export interface Avatar3 {
		href: string;
	}

	export interface Links3 {
		self: Self3;
		html: Html3;
		avatar: Avatar3;
	}

	export interface Workspace {
		slug: string;
		type: string;
		name: string;
		links: Links3;
		uuid: string;
	}

	export interface Self4 {
		href: string;
	}

	export interface Html4 {
		href: string;
	}

	export interface Avatar4 {
		href: string;
	}

	export interface Links4 {
		self: Self4;
		html: Html4;
		avatar: Avatar4;
	}

	export interface Owner {
		username: string;
		display_name: string;
		type: string;
		uuid: string;
		links: Links4;
	}

	export interface BitBucketRepository {
		scm: string;
		website: string;
		has_wiki: boolean;
		uuid: string;
		links: Links;
		fork_policy: string;
		full_name: string;
		name: string;
		project: Project;
		language: string;
		created_on: string;
		mainbranch: Mainbranch;
		workspace: Workspace;
		has_issues: boolean;
		owner: Owner;
		updated_on: string;
		size: number;
		type: string;
		slug: string;
		is_private: boolean;
		description: string;
	}

	export interface Data {
		pagelen: number;
		size: number;
		values: BitBucketRepository[];
		page: number;
		next: string;
	}

	export interface Headers {
	}

	export interface RootObject {
		data: Data;
		headers: Headers;
		status: number;
		url: string;
	}

}
