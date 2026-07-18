#ifndef SORT_ALGORITHMS_H
#define SORT_ALGORITHMS_H

#include <string>
#include <vector>

class SortAlgorithms {
public:
    static std::vector<int> sortByTitle(const std::vector<int>& songIds, const std::vector<std::string>& titles);
    static std::vector<int> sortByArtist(const std::vector<int>& songIds, const std::vector<std::string>& artists);
    static std::vector<int> sortByDuration(const std::vector<int>& songIds, const std::vector<int>& durations);
};

#endif
