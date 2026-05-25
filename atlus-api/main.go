package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"atlus-api/atlusdb"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

func (s *Server) setupRoutes() {
	s.router.GET("/health", healthCheck)
	s.router.GET("/parishioners", s.getParishioners)
	s.router.GET("/parishioners/:id", s.getParishionerByID)
	s.router.POST("/parishioners", s.createParishioner)
	s.router.DELETE("/parishioners/:id", s.deleteParishionerByID)
	s.router.PUT("/parishioners/:id", s.updateParishionerByID)
}

func main() {
	dbName := os.Getenv("MYSQL_DATABASE")
	dbUser := os.Getenv("MYSQL_USER")
	dbPassword := os.Getenv("MYSQL_PASSWORD")

	dsn := fmt.Sprintf("%s:%s@tcp(db:3306)/%s?parseTime=true",
		dbUser, dbPassword, dbName,
	)

	conn, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("cannot connect to mysql database:", err)
	}

	queries := atlusdb.New(conn)

	server := NewServer(queries)
	err = server.Start(":8080")
	if err != nil {
		log.Fatal("cannot start server:", err)
	}
}

// Health check endpoint to verify that the API is running
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

// Get all the parishioners
func (s *Server) getParishioners(c *gin.Context) {

	parishioners, err := s.queries.ListParishioners((c.Request.Context()))
	if err != nil {
		log.Printf("[!] Error: Unable to retrieve parishioners: %s", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve parishioners"})
		return
	}

	if parishioners == nil {
		parishioners = []atlusdb.Parishioner{}
	}

	result := make([]ParishionerResponse, len(parishioners))
	for i, p := range parishioners {
		result[i] = parishionerDbSchemaConvert(p)
	}

	c.JSON(http.StatusOK, gin.H{
		"parishioners": result,
	})
}

// Get a specific parishioner by ID
func (s *Server) getParishionerByID(c *gin.Context) {
	id := c.Param("id")

	parishioner, err := s.queries.GetParishioner(c.Request.Context(), id)

	if err != nil {
		log.Printf("[!] Error: Unable to retrieve parishioner: %s", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Parishioner not found"})
		return
	}

	c.JSON(http.StatusOK, parishionerDbSchemaConvert(parishioner))
}

// Create a new parishioner
func (s *Server) createParishioner(c *gin.Context) {
	var newParishioner CreateParishionerRequest

	if bindErr := c.BindJSON(&newParishioner); bindErr != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "Unable to create parishioner"})
		return
	}

	createdParishioner, err := s.queries.CreateParishioner(c.Request.Context(),
		atlusdb.CreateParishionerParams{
			Name:         newParishioner.Name,
			City:         newParishioner.City,
			Email:        newParishioner.Email,
			IsRegistered: *newParishioner.IsRegistered,
			Members:      int32(newParishioner.Members),
		})

	if err != nil {
		log.Printf("[!] Error: Unable to create parishioner: %s", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create new parishioner"})
		return
	}

	c.JSON(http.StatusCreated, createdParishioner)
}

// Update a parishioner
func (s *Server) updateParishionerByID(c *gin.Context) {
	id := c.Param("id")
	var updatedParishioner CreateParishionerRequest

	if bindErr := c.BindJSON(&updatedParishioner); bindErr != nil {
		return
	}

	err := s.queries.UpdateParishioner(c.Request.Context(), atlusdb.UpdateParishionerParams{
		Name:         updatedParishioner.Name,
		City:         updatedParishioner.City,
		Email:        updatedParishioner.Email,
		IsRegistered: *updatedParishioner.IsRegistered,
		Members:      int32(updatedParishioner.Members),
		ID:           id,
	})

	if err != nil {
		log.Printf("[!] Error: Unable to update parishioner: %s", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update parishioner"})
		return
	}

	c.JSON(http.StatusCreated, updatedParishioner)
}

// Delete a parishioner by id
func (s *Server) deleteParishionerByID(c *gin.Context) {
	id := c.Param("id")
	err := s.queries.DeleteParishioner(c.Request.Context(), id)

	if err != nil {
		log.Printf("[!] Error: Unable to create parishioner: %s", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Unable to delete parishioner"})
		return
	}

	c.Status(http.StatusNoContent)
}
