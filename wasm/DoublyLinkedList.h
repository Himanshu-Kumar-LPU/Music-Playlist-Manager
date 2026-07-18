#ifndef DOUBLY_LINKED_LIST_H
#define DOUBLY_LINKED_LIST_H

#include <cstddef>
#include <vector>

class DoublyLinkedList {
public:
    struct Node {
        int songId;
        Node* prev;
        Node* next;
    };

    DoublyLinkedList();
    ~DoublyLinkedList();

    void insertAtEnd(int songId);
    void insertAt(int index, int songId);
    void removeAt(int index);
    void removeById(int songId);
    int moveNext(int currentId) const;
    int movePrev(int currentId) const;
    std::vector<int> toArray() const;

private:
    Node* head_;
    Node* tail_;
    std::size_t size_;

    Node* findById(int songId) const;
    Node* findByIndex(int index) const;
};

#endif
