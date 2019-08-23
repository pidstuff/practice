#include <stdio.h>

int main()
{
    /* Exercise 1-12
       Write a program that prints its input one word per line.
    */
    printf("Input text (press ctrl+d to end):\n");
    int c, in = 1, out = 0, state = 0;
    
    while ((c = getchar()) != EOF)
    {
        if (state == in && (c == ' ' || c == '\n' || c == '\t'))
        {
            printf("\n");
            state = out;
        }
        if (c == ' ' || c == '\n' || c == '\t')
            state = out;
        else
        {
            state = in;
            putchar(c);
        }
    }
}
