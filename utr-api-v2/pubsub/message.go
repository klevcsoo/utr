package pubsub

type Message struct {
	Type    string `json:"type"`
	Content any    `json:"content"`
}

const (
	MessageTypeObject = "object"
	MessageTypeList   = "list"
	MessageTypeText   = "text"
	MessageTypeError  = "error"
)
