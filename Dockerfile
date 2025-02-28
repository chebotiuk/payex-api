# Use an official Golang image to build the binary
FROM golang:1.19 AS builder

# Set the working directory in the container
WORKDIR /workspace

# Clone the Celestia repository
RUN git clone https://github.com/celestiaorg/celestia-core.git

# Build the Celestia CLI
WORKDIR /workspace/celestia-core
RUN make celestia

# Start a new stage for the final image
FROM debian:bullseye-slim

# Copy the Celestia binary from the builder stage
COPY --from=builder /workspace/celestia-core/celestia /usr/local/bin/celestia

# Set the working directory
WORKDIR /workspace

# Set the default command
ENTRYPOINT ["/usr/local/bin/celestia"]
