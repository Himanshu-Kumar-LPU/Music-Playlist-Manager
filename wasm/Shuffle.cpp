#include "Shuffle.h"

#include <algorithm>
#include <random>

std::vector<int> Shuffle::fisherYatesShuffle(const std::vector<int>& songIds) {
    std::vector<int> result = songIds;
    std::random_device rd;
    std::mt19937 generator(rd());
    for (int i = static_cast<int>(result.size()) - 1; i > 0; --i) {
        std::uniform_int_distribution<int> dist(0, i);
        int j = dist(generator);
        std::swap(result[static_cast<std::size_t>(i)], result[static_cast<std::size_t>(j)]);
    }
    return result;
}
