package ini

import (
	"github.com/spf13/viper"
	"time"
)

//goland:noinspection SpellCheckingInspection
type Config struct {
	DBHost string `mapstructure:"POSTGRES_HOST"`
	DBUser string `mapstructure:"POSTGRES_USER"`
	DBPass string `mapstructure:"POSTGRES_PASS"`
	DBName string `mapstructure:"POSTGRES_DB"`
	DBPort string `mapstructure:"POSTGRES_PORT"`

	JwtSecret    string        `mapstructure:"JWT_SECRET"`
	JwtExpiresIn time.Duration `mapstructure:"JWT_EXPIRED_IN"`
	JwtMaxAge    int           `mapstructure:"JWT_MAXAGE"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigType("env")
	viper.SetConfigName("app")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
