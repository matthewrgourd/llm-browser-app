package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

var Log *logrus.Logger

// Init initializes the logger with the specified level
func Init(level string) {
	Log = logrus.New()
	Log.SetOutput(os.Stdout)
	Log.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
		PrettyPrint:     false,
	})

	logLevel, err := logrus.ParseLevel(level)
	if err != nil {
		logLevel = logrus.InfoLevel
	}
	Log.SetLevel(logLevel)

	Log.WithFields(logrus.Fields{
		"level": logLevel.String(),
	}).Info("Logger initialized")
}

// GetLogger returns the configured logger instance
func GetLogger() *logrus.Logger {
	if Log == nil {
		Init("info")
	}
	return Log
}

