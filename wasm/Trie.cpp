#include "Trie.h"

#include <cctype>

Trie::Node::Node() : isEndOfWord(false) {
    for (int i = 0; i < 26; ++i) {
        children[i] = nullptr;
    }
}

Trie::Trie() : root_(new Node()) {}

Trie::~Trie() {
    destroy(root_);
}

void Trie::insert(const std::string& word, int songId) {
    Node* current = root_;
    for (char ch : word) {
        char lower = static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));
        int index = lower - 'a';
        if (index < 0 || index >= 26) {
            continue;
        }
        if (current->children[index] == nullptr) {
            current->children[index] = new Node();
        }
        current = current->children[index];
    }
    current->isEndOfWord = true;
    current->songIds.push_back(songId);
}

std::vector<int> Trie::search(const std::string& prefix) const {
    Node* current = root_;
    for (char ch : prefix) {
        char lower = static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));
        int index = lower - 'a';
        if (index < 0 || index >= 26 || current->children[index] == nullptr) {
            return {};
        }
        current = current->children[index];
    }

    std::vector<int> results;
    collect(current, results);
    return results;
}

void Trie::destroy(Node* node) {
    if (node == nullptr) {
        return;
    }
    for (int i = 0; i < 26; ++i) {
        destroy(node->children[i]);
    }
    delete node;
}

void Trie::collect(Node* node, std::vector<int>& results) const {
    if (node == nullptr) {
        return;
    }
    if (!node->songIds.empty()) {
        results.insert(results.end(), node->songIds.begin(), node->songIds.end());
    }
    for (int i = 0; i < 26; ++i) {
        collect(node->children[i], results);
    }
}
