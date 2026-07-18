#ifndef STACK_H
#define STACK_H

#include <cstddef>
#include <vector>

class Stack {
public:
    Stack();
    ~Stack();

    void push(int songId);
    int pop();
    int peek() const;
    bool isEmpty() const;
    std::vector<int> toArray() const;

private:
    int* data_;
    std::size_t size_;
    std::size_t capacity_;

    void resize(std::size_t newCapacity);
};

#endif
