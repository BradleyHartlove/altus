package main

type CreateParishionerRequest struct {
	Name         string `json:"name" binding:"required"`
	City         string `json:"city" binding:"required"`
	Email        string `json:"email" binding:"required"`
	IsRegistered *bool  `json:"is_registered" binding:"required"`
	Members      int    `json:"members" binding:"required,gte=1"`
}

type ParishionerResponse struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	City         string `json:"city"`
	Email        string `json:"email"`
	IsRegistered bool   `json:"is_registered"`
	Members      int    `json:"members"`
}
