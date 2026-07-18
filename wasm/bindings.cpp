#include <emscripten/bind.h>
#include <vector>
#include <string>

#include "DoublyLinkedList.h"
#include "HashMap.h"
#include "Queue.h"
#include "Shuffle.h"
#include "SortAlgorithms.h"
#include "Stack.h"
#include "Trie.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(music_playlist_manager) {
    class_<DoublyLinkedList>("DoublyLinkedList")
        .constructor<>()
        .function("insertAtEnd", &DoublyLinkedList::insertAtEnd)
        .function("insertAt", &DoublyLinkedList::insertAt)
        .function("removeAt", &DoublyLinkedList::removeAt)
        .function("removeById", &DoublyLinkedList::removeById)
        .function("moveNext", &DoublyLinkedList::moveNext)
        .function("movePrev", &DoublyLinkedList::movePrev)
        .function("toArray", &DoublyLinkedList::toArray);

    class_<Stack>("Stack")
        .constructor<>()
        .function("push", &Stack::push)
        .function("pop", &Stack::pop)
        .function("peek", &Stack::peek)
        .function("isEmpty", &Stack::isEmpty)
        .function("toArray", &Stack::toArray);

    class_<Queue>("Queue")
        .constructor<>()
        .function("enqueue", &Queue::enqueue)
        .function("dequeue", &Queue::dequeue)
        .function("peek", &Queue::peek)
        .function("isEmpty", &Queue::isEmpty)
        .function("toArray", &Queue::toArray);

    class_<HashMap>("HashMap")
        .constructor<>()
        .function("set", &HashMap::set)
        .function("get", &HashMap::get)
        .function("has", &HashMap::has)
        .function("remove", &HashMap::remove)
        .function("keys", &HashMap::keys);

    class_<Trie>("Trie")
        .constructor<>()
        .function("insert", &Trie::insert)
        .function("search", &Trie::search);

    class_<SortAlgorithms>("SortAlgorithms")
        .constructor<>()
        .class_function("sortByTitle", &SortAlgorithms::sortByTitle)
        .class_function("sortByArtist", &SortAlgorithms::sortByArtist)
        .class_function("sortByDuration", &SortAlgorithms::sortByDuration);

    class_<Shuffle>("Shuffle")
        .constructor<>()
        .class_function("fisherYatesShuffle", &Shuffle::fisherYatesShuffle);

    register_vector<int>("VectorInt");
    register_vector<std::string>("VectorString");
}
