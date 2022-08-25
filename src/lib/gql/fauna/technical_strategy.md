how do I search homes by cities?

One way is to create an index of all homes, with a lambda grabbing the ref of the associated address, then using its city as the first value to return. The second value is thus' the ref of the home.

It is similar to how the range index was achieved. However, the way to do autocomplete/full text search is different.

Last of all, we need to create an index for the bedrooms. This is also a range index. However, we will use it in a straightforward way until we need 6 or more bedrooms.
