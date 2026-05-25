package main

import (
	"atlus-api/atlusdb"
)

func parishionerDbSchemaConvert(p atlusdb.Parishioner) ParishionerResponse {
	return ParishionerResponse{
		ID:           p.ID,
		Name:         p.Name,
		City:         p.City,
		Email:        p.Email,
		IsRegistered: p.IsRegistered,
		Members:      int(p.Members),
	}
}
