package handlers

type Report struct {
	ID    int32   `json:"id"`
	Item  string  `json:"item"`
	Price float32 `json:"price"`
	HSN   int     `json:"hsn"`
}

func RetriveData() error {
	return nil
}