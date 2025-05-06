package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	jwtKey []byte
	repo   UserRepository
}

func NewHandler(jwtKey []byte, repo UserRepository) *Handler {
	return &Handler{jwtKey: jwtKey, repo: repo}
}

var users = make(map[string]User) // временная база
var userIDCounter = 1

// регистрация пользователя
func (h *Handler) Register(c *gin.Context) {
	var input User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	input.Password = string(hash)

	err = h.repo.CreateUser(input)
	if err != nil {
		if err == ErrUserExists {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}


//функция обработки входа пользователя в аккаунт
func (h *Handler) Login(c *gin.Context) {
	var input User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	user, err := h.repo.GetUserByUsername(input.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	token, err := GenerateToken(user.ID, h.jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
