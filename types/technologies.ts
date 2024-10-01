export interface Technology {
	id: string; // uuid
	name: string;
	created_at: string;
	updated_at: string;
}

// region API

// #region Responses

export interface IndexTechnologiesResponse {
	technologies: Technology[];
};

// #endregion

// #endregion
