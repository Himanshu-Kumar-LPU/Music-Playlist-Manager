#ifndef QUEUE_H
#define QUEUE_H

#include <cstddef>
#include <vector>

class Queue {
public:
    Queue();
    ~Queue();

    void enqueue(int songId);
    int dequeue();
    int peek() const;
    bool isEmpty() const;
    std::vector<int> toArray() const;

private:
    int* data_;
    std::size_t capacity_;
    std::size_t front_;
    std::size_t size_;

    void resize(std::size_t newCapacity);
};

#endif
