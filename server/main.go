package main

import (
	"encoding/json"
	"fmt"
	"go/format"
	"log"
	"net/http"
	"os"
)

type FormatRequest struct {
	Code string `json:"code"`
}

type FormatResponse struct {
	FormattedCode string `json:"formattedCode,omitempty"`
	Error         string `json:"error,omitempty"`
}

func formatHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST requests
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request
	var req FormatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(FormatResponse{Error: "Invalid request format"})
		return
	}

	// Format the code
	formatted, err := format.Source([]byte(req.Code))
	if err != nil {
		json.NewEncoder(w).Encode(FormatResponse{Error: err.Error()})
		return
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(FormatResponse{FormattedCode: string(formatted)})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/format", formatHandler)

	fmt.Printf("Server running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

