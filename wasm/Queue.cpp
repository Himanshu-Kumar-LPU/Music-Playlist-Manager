#include "Queue.h"

#include <stdexcept>

Queue::Queue() : data_(nullptr), capacity_(0), front_(0), size_(0) {}

Queue::~Queue() {
    delete[] data_;
}

void Queue::enqueue(int songId) {
    if (size_ == capacity_) {
        std::size_t newCapacity = capacity_ == 0 ? 4 : capacity_ * 2;
        resize(newCapacity);
    }
    std::size_t index = (front_ + size_) % capacity_;
    data_[index] = songId;
    ++size_;
}

int Queue::dequeue() {
    if (isEmpty()) {
        throw std::out_of_range("Queue is empty");
    }
    int result = data_[front_];
    front_ = (front_ + 1) % capacity_;
    --size_;
    return result;
}

int Queue::peek() const {
    if (isEmpty()) {
        throw std::out_of_range("Queue is empty");
    }
    return data_[front_];
}

bool Queue::isEmpty() const {
    return size_ == 0;
}

std::vector<int> Queue::toArray() const {
    std::vector<int> result;
    result.reserve(size_);
    for (std::size_t i = 0; i < size_; ++i) {
        result.push_back(data_[(front_ + i) % capacity_]);
    }
    return result;
}

void Queue::resize(std::size_t newCapacity) {
    int* newData = new int[newCapacity];
    for (std::size_t i = 0; i < size_; ++i) {
        newData[i] = data_[(front_ + i) % capacity_];
    }
    delete[] data_;
    data_ = newData;
    capacity_ = newCapacity;
    front_ = 0;
}
