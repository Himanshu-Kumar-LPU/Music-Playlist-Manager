#ifndef HASH_MAP_H
#define HASH_MAP_H

#include <cstddef>
#include <vector>

class HashMap {
public:
    struct Entry {
        int key;
        int value;
        Entry* next;
    };

    HashMap();
    ~HashMap();

    void set(int key, int value);
    int get(int key) const;
    bool has(int key) const;
    void remove(int key);
    std::vector<int> keys() const;

private:
    static const std::size_t kBucketCount = 64;
    Entry* buckets_[kBucketCount];

    static unsigned int hash(int key);
    Entry* findEntry(int key) const;
    Entry* findEntry(int key, Entry* bucket) const;
};

#endif
