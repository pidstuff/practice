#include <stdio.h>

int main()
{
    /* Exercise 1-9
       Write a program to copy its input to its output,
       replacing each string of one or more blanks by a single blank.
    */
    printf("Input text (press ctrl+d to end):\n");
    int c;
    char lastchar;
    
    while ((c = getchar()) != EOF)
    {
        if (lastchar != ' ' || c != ' ')
            putchar(c);
        lastchar = c;
    }
}
