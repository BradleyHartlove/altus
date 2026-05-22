package main

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

type Parishioner struct {
	ID           string `json:"id,omitempty"`
	Name         string `json:"name" binding:"required"`
	City         string `json:"city" binding:"required"`
	Status       string `json:"status" binding:"required"`
	Email        string `json:"email" binding:"required"`
	IsRegistered *bool  `json:"is_registered" binding:"required"`
	Members      int    `json:"members" binding:"required,gte=1"`
}

func main() {
	router := gin.Default()
	router.GET("/health", healthCheck)
	router.GET("/parishioners", getParishioners)
	router.GET("/parishioners/:id", getParishionerByID)
	router.POST("/parishioners", createParishioner)
	router.DELETE("/parishioners/:id", deleteParishionerByID)

	router.Run()
}

var parishioners = []Parishioner{
	{ID: uuid.NewString(), Name: "John Doe", City: "New York", Status: "active", IsRegistered: new(true), Members: 5, Email: "john.doe@gmail.com"},
	{ID: uuid.NewString(), Name: "Jane Smith", City: "Los Angeles", Status: "inactive", IsRegistered: new(false), Members: 3, Email: "jane.smith@yahoo.mail"},
}

// Health check endpoint to verify that the API is running
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

// Get all the parishioners
func getParishioners(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"parishioners": parishioners,
	})
}

// Get a specific parishioner by ID
func getParishionerByID(c *gin.Context) {
	id := c.Param("id")
	for _, p := range parishioners {
		if p.ID == id {
			c.JSON(http.StatusOK, p)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"message": "Parishioner not found"})
}

// Create a new parishioner
func createParishioner(c *gin.Context) {
	var newParishioner Parishioner

	if err := c.BindJSON(&newParishioner); err != nil {
		return
	}

	newParishioner.ID = uuid.NewString()
	parishioners = append(parishioners, newParishioner)
	c.IndentedJSON(http.StatusCreated, newParishioner)
}

// Delete a parishioner by id
func deleteParishionerByID(c *gin.Context) {
	id := c.Param("id")
	for i, p := range parishioners {
		if p.ID == id {
			parishioners = append(parishioners[:i], parishioners[i+1:]...)
			c.Status(http.StatusNoContent)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"message": "Parishioner not found"})
}
