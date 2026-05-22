package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Parishioner struct {
	ID           string `json:"id,omitempty"`
	Name         string `json:"name" binding:"required"`
	City         string `json:"city" binding:"required"`
	Email        string `json:"email" binding:"required"`
	IsRegistered *bool  `json:"is_registered" binding:"required"`
	Members      int    `json:"members" binding:"required,gte=1"`
}

func main() {
	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS", "PUT"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: false,
	}))
	router.GET("/health", healthCheck)
	router.GET("/parishioners", getParishioners)
	router.GET("/parishioners/:id", getParishionerByID)
	router.POST("/parishioners", createParishioner)
	router.PUT("/parishioners/:id", updateParishionerByID)
	router.DELETE("/parishioners/:id", deleteParishionerByID)

	router.Run()
}

var parishioners = []Parishioner{
	{ID: uuid.NewString(), Name: "John Doe", City: "New York", IsRegistered: new(true), Members: 5, Email: "john.doe@gmail.com"},
	{ID: uuid.NewString(), Name: "Jane Smith", City: "Los Angeles", IsRegistered: new(false), Members: 3, Email: "jane.smith@yahoo.mail"},
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

// Update a parishioner
func updateParishionerByID(c *gin.Context) {
	id := c.Param("id")
	var updatedParishioner Parishioner

	if err := c.BindJSON(&updatedParishioner); err != nil {
		return
	}

	updatedParishioner.ID = uuid.NewString()

	for i, p := range parishioners {
		if p.ID == id {
			parishioners[i] = updatedParishioner
			c.IndentedJSON(http.StatusOK, updatedParishioner)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"message": "Parishioner not found"})
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
