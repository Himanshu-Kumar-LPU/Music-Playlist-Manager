#ifndef TRIE_H
#define TRIE_H

#include <string>
#include <vector>

class Trie {
public:
    struct Node {
        bool isEndOfWord;
        std::vector<int> songIds;
        Node* children[26];

        Node();
    };

    Trie();
    ~Trie();

    void insert(const std::string& word, int songId);
    std::vector<int> search(const std::string& prefix) const;

private:
    Node* root_;
    void destroy(Node* node);
    void collect(Node* node, std::vector<int>& results) const;
};

#endif
