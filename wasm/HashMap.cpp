#include "HashMap.h"

#include <stdexcept>

HashMap::HashMap() {
    for (std::size_t i = 0; i < kBucketCount; ++i) {
        buckets_[i] = nullptr;
    }
}

HashMap::~HashMap() {
    for (std::size_t i = 0; i < kBucketCount; ++i) {
        Entry* current = buckets_[i];
        while (current != nullptr) {
            Entry* next = current->next;
            delete current;
            current = next;
        }
    }
}

void HashMap::set(int key, int value) {
    std::size_t index = hash(key) % kBucketCount;
    Entry* entry = findEntry(key, buckets_[index]);
    if (entry != nullptr) {
        entry->value = value;
        return;
    }

    Entry* newEntry = new Entry{key, value, buckets_[index]};
    buckets_[index] = newEntry;
}

int HashMap::get(int key) const {
    Entry* entry = findEntry(key);
    if (entry == nullptr) {
        throw std::out_of_range("Key not found");
    }
    return entry->value;
}

bool HashMap::has(int key) const {
    return findEntry(key) != nullptr;
}

void HashMap::remove(int key) {
    std::size_t index = hash(key) % kBucketCount;
    Entry* prev = nullptr;
    Entry* current = buckets_[index];
    while (current != nullptr) {
        if (current->key == key) {
            if (prev == nullptr) {
                buckets_[index] = current->next;
            } else {
                prev->next = current->next;
            }
            delete current;
            return;
        }
        prev = current;
        current = current->next;
    }
}

std::vector<int> HashMap::keys() const {
    std::vector<int> result;
    for (std::size_t i = 0; i < kBucketCount; ++i) {
        Entry* current = buckets_[i];
        while (current != nullptr) {
            result.push_back(current->key);
            current = current->next;
        }
    }
    return result;
}

unsigned int HashMap::hash(int key) {
    unsigned int value = static_cast<unsigned int>(key);
    value ^= value >> 16;
    value *= 0x85ebca6bU;
    value ^= value >> 13;
    value *= 0xc2b2ae3dU;
    value ^= value >> 16;
    return value;
}

HashMap::Entry* HashMap::findEntry(int key) const {
    std::size_t index = hash(key) % kBucketCount;
    return findEntry(key, buckets_[index]);
}

HashMap::Entry* HashMap::findEntry(int key, Entry* bucket) const {
    Entry* current = bucket;
    while (current != nullptr) {
        if (current->key == key) {
            return current;
        }
        current = current->next;
    }
    return nullptr;
}
