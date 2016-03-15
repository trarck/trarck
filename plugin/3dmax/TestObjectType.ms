fn typeof v =
(
    print((ClassOf v) as string+","+v as string)
    print((SuperClassOf v) as string)
)

struct Test(a,b)

typeof(0)
typeof 1.0
typeof "ab"
typeof True
typeof #(1,2,3)
typeof(Test())
typeof(color 1 1 1)
typeof([1,1,1])
typeof(normTime 0.5)