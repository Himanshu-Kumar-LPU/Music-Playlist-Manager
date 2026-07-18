#include "SortAlgorithms.h"

#include <algorithm>
#include <cstddef>
#include <functional>

namespace {

std::vector<int> mergeSortInternal(const std::vector<int>& values, const std::vector<std::string>& keys, bool stringMode) {
    if (values.size() <= 1) {
        return values;
    }

    std::size_t mid = values.size() / 2;
    std::vector<int> left(values.begin(), values.begin() + mid);
    std::vector<int> right(values.begin() + mid, values.end());
    std::vector<std::string> leftKeys(keys.begin(), keys.begin() + mid);
    std::vector<std::string> rightKeys(keys.begin() + mid, keys.end());

    left = mergeSortInternal(left, leftKeys, stringMode);
    right = mergeSortInternal(right, rightKeys, stringMode);

    std::vector<int> merged;
    merged.reserve(values.size());
    std::size_t i = 0;
    std::size_t j = 0;
    while (i < left.size() && j < right.size()) {
        const std::string& leftKey = keys[left.size() == 0 ? 0 : i];
        const std::string& rightKey = keys[right.size() == 0 ? 0 : j];
        (void)stringMode;
        if (leftKey <= rightKey) {
            merged.push_back(left[i]);
            ++i;
        } else {
            merged.push_back(right[j]);
            ++j;
        }
    }

    while (i < left.size()) {
        merged.push_back(left[i]);
        ++i;
    }
    while (j < right.size()) {
        merged.push_back(right[j]);
        ++j;
    }
    return merged;
}

std::vector<int> sortByKey(const std::vector<int>& songIds, const std::vector<std::string>& keys) {
    if (songIds.size() != keys.size()) {
        return songIds;
    }
    std::vector<int> indices(songIds.size());
    for (std::size_t i = 0; i < songIds.size(); ++i) {
        indices[i] = static_cast<int>(i);
    }
    std::vector<std::string> keyCopy = keys;
    std::stable_sort(indices.begin(), indices.end(), [&](int lhs, int rhs) {
        return keyCopy[static_cast<std::size_t>(lhs)] < keyCopy[static_cast<std::size_t>(rhs)];
    });
    std::vector<int> result;
    result.reserve(indices.size());
    for (int index : indices) {
        result.push_back(songIds[static_cast<std::size_t>(index)]);
    }
    return result;
}

std::vector<int> sortByDurationValues(const std::vector<int>& songIds, const std::vector<int>& durations) {
    if (songIds.size() != durations.size()) {
        return songIds;
    }
    std::vector<int> indices(songIds.size());
    for (std::size_t i = 0; i < songIds.size(); ++i) {
        indices[i] = static_cast<int>(i);
    }
    std::stable_sort(indices.begin(), indices.end(), [&](int lhs, int rhs) {
        return durations[static_cast<std::size_t>(lhs)] < durations[static_cast<std::size_t>(rhs)];
    });
    std::vector<int> result;
    result.reserve(indices.size());
    for (int index : indices) {
        result.push_back(songIds[static_cast<std::size_t>(index)]);
    }
    return result;
}

}  // namespace

std::vector<int> SortAlgorithms::sortByTitle(const std::vector<int>& songIds, const std::vector<std::string>& titles) {
    return sortByKey(songIds, titles);
}

std::vector<int> SortAlgorithms::sortByArtist(const std::vector<int>& songIds, const std::vector<std::string>& artists) {
    return sortByKey(songIds, artists);
}

std::vector<int> SortAlgorithms::sortByDuration(const std::vector<int>& songIds, const std::vector<int>& durations) {
    return sortByDurationValues(songIds, durations);
}
