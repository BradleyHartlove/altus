package main

import (
	"atlus-api/atlusdb"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router  *gin.Engine
	queries *atlusdb.Queries
}

func NewServer(q *atlusdb.Queries) *Server {
	s := &Server{
		queries: q,
		router:  gin.Default(),
	}

	s.router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS", "PUT"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: false,
	}))

	s.setupRoutes()
	return s
}

func (s *Server) Start(address string) error {
	s.router.SetTrustedProxies(nil)
	return s.router.Run(address)
}
