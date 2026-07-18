#include "DoublyLinkedList.h"

#include <stdexcept>

DoublyLinkedList::DoublyLinkedList() : head_(nullptr), tail_(nullptr), size_(0) {}

DoublyLinkedList::~DoublyLinkedList() {
    Node* current = head_;
    while (current != nullptr) {
        Node* next = current->next;
        delete current;
        current = next;
    }
}

void DoublyLinkedList::insertAtEnd(int songId) {
    insertAt(static_cast<int>(size_), songId);
}

void DoublyLinkedList::insertAt(int index, int songId) {
    if (index < 0 || index > static_cast<int>(size_)) {
        throw std::out_of_range("Index out of range");
    }

    Node* newNode = new Node{songId, nullptr, nullptr};
    if (size_ == 0) {
        head_ = tail_ = newNode;
        size_ = 1;
        return;
    }

    if (index == 0) {
        newNode->next = head_;
        head_->prev = newNode;
        head_ = newNode;
    } else if (index == static_cast<int>(size_)) {
        newNode->prev = tail_;
        tail_->next = newNode;
        tail_ = newNode;
    } else {
        Node* current = findByIndex(index);
        newNode->prev = current->prev;
        newNode->next = current;
        current->prev->next = newNode;
        current->prev = newNode;
    }
    ++size_;
}

void DoublyLinkedList::removeAt(int index) {
    if (index < 0 || index >= static_cast<int>(size_)) {
        throw std::out_of_range("Index out of range");
    }

    Node* victim = findByIndex(index);
    if (victim->prev != nullptr) {
        victim->prev->next = victim->next;
    } else {
        head_ = victim->next;
    }

    if (victim->next != nullptr) {
        victim->next->prev = victim->prev;
    } else {
        tail_ = victim->prev;
    }

    delete victim;
    --size_;
}

void DoublyLinkedList::removeById(int songId) {
    Node* victim = findById(songId);
    if (victim == nullptr) {
        return;
    }

    if (victim->prev != nullptr) {
        victim->prev->next = victim->next;
    } else {
        head_ = victim->next;
    }

    if (victim->next != nullptr) {
        victim->next->prev = victim->prev;
    } else {
        tail_ = victim->prev;
    }

    delete victim;
    --size_;
}

int DoublyLinkedList::moveNext(int currentId) const {
    Node* current = findById(currentId);
    if (current == nullptr || current->next == nullptr) {
        return currentId;
    }
    return current->next->songId;
}

int DoublyLinkedList::movePrev(int currentId) const {
    Node* current = findById(currentId);
    if (current == nullptr || current->prev == nullptr) {
        return currentId;
    }
    return current->prev->songId;
}

std::vector<int> DoublyLinkedList::toArray() const {
    std::vector<int> result;
    result.reserve(size_);
    Node* current = head_;
    while (current != nullptr) {
        result.push_back(current->songId);
        current = current->next;
    }
    return result;
}

DoublyLinkedList::Node* DoublyLinkedList::findById(int songId) const {
    Node* current = head_;
    while (current != nullptr) {
        if (current->songId == songId) {
            return current;
        }
        current = current->next;
    }
    return nullptr;
}

DoublyLinkedList::Node* DoublyLinkedList::findByIndex(int index) const {
    if (index < 0 || index >= static_cast<int>(size_)) {
        throw std::out_of_range("Index out of range");
    }

    Node* current = head_;
    for (int i = 0; i < index; ++i) {
        current = current->next;
    }
    return current;
}
