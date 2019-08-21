#include <stdio.h>

int main()
{
    /* Exercise 1-8
       Write a program to count blanks, tabs, and newlines.
    */
    printf("Input text (press ctrl+d to end):\n");
    int c, blanks, tabs, newlines;
    blanks = tabs = newlines = 0;
    
    while ((c = getchar()) != EOF)
    {
        if (c == '\n')
            ++newlines;
        if (c == ' ')
            blanks++;
        if (c == '\t')
            tabs++;
    }
    
    printf("\nBlanks: %d\n", blanks);
    printf("Tabs: %d\n", tabs);
    printf("New Lines: %d\n", newlines);
}
