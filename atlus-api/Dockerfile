FROM golang:1.26.3-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN ls
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server .

FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /
COPY --from=builder --chown=nonroot:nonroot /app/server /server
EXPOSE 8080
USER nonroot:nonroot

ENTRYPOINT ["/server"]