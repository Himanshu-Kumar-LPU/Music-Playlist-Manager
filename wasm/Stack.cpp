#include "Stack.h"

#include <stdexcept>

Stack::Stack() : data_(nullptr), size_(0), capacity_(0) {}

Stack::~Stack() {
    delete[] data_;
}

void Stack::push(int songId) {
    if (size_ == capacity_) {
        std::size_t newCapacity = capacity_ == 0 ? 4 : capacity_ * 2;
        resize(newCapacity);
    }
    data_[size_++] = songId;
}

int Stack::pop() {
    if (isEmpty()) {
        throw std::out_of_range("Stack is empty");
    }
    return data_[--size_];
}

int Stack::peek() const {
    if (isEmpty()) {
        throw std::out_of_range("Stack is empty");
    }
    return data_[size_ - 1];
}

bool Stack::isEmpty() const {
    return size_ == 0;
}

std::vector<int> Stack::toArray() const {
    std::vector<int> result;
    result.reserve(size_);
    for (std::size_t i = 0; i < size_; ++i) {
        result.push_back(data_[i]);
    }
    return result;
}

void Stack::resize(std::size_t newCapacity) {
    int* newData = new int[newCapacity];
    for (std::size_t i = 0; i < size_; ++i) {
        newData[i] = data_[i];
    }
    delete[] data_;
    data_ = newData;
    capacity_ = newCapacity;
}
