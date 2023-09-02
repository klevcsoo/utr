package utils

type ResponseMessage struct {
	Type    string `json:"type"`
	Content any    `json:"content"`
}

const (
	ResponseMessageTypeObject = "object"
	ResponseMessageTypeList   = "list"
	ResponseMessageTypeText   = "text"
	ResponseMessageTypeError  = "error"
)

func NewObjectResponseMessage[T interface{}](object T) ResponseMessage {
	return ResponseMessage{
		Type:    ResponseMessageTypeObject,
		Content: object,
	}
}

func NewListResponseMessage[T interface{}](list []T) ResponseMessage {
	return ResponseMessage{
		Type:    ResponseMessageTypeList,
		Content: list,
	}
}

func NewTextResponseMessage(text string) ResponseMessage {
	return ResponseMessage{
		Type:    ResponseMessageTypeText,
		Content: text,
	}
}

func NewErrorResponseMessage(errorText string) ResponseMessage {
	return ResponseMessage{
		Type:    ResponseMessageTypeError,
		Content: errorText,
	}
}
