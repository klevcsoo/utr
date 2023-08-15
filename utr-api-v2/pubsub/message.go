package pubsub

type Message struct {
	Headers string `json:"headers"`
	Body    any    `json:"body"`
}
