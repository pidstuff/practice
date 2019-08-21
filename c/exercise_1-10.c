#include <stdio.h>

int main()
{
    /* Exercise 1-10
       Write a program to copy its input to its output,
       replacing each tab by '\t', each backspace by '\b',
       and each backslash by '\\'.
    */
    printf("Input text (press ctrl+d to end):\n");
    int c;
    
    while ((c = getchar()) != EOF)
    {
        if (c == '\t')
            printf("\\t");
        if (c == '\b')
            printf("\\b");
        if (c == '\\')
            printf("\\\\");
        if (c != '\t' && c != '\b' && c != '\\')
            putchar(c);
    }
}
