#include <stdio.h>

#define MAXWORDLENGTH 10

int main()
{
    /* Exercise 1-13
       Write a program to print a histogram of the lengths of words in its
       input. It is easy to draw the histogram with the bars horizontal;
       a vertical orientation is more challenging.
    */
    printf("Input text (press ctrl+d to end):\n");
    int i, c, in, out, state, wctr, wordlengths[MAXWORDLENGTH];
    in = 1;
    state = out = wctr = 0;
    
    /* Sets array values to 0 */
    for (i = 0; i < MAXWORDLENGTH; i++)
    {
        wordlengths[i] = 0;
    }
    
    while ((c = getchar()) != EOF)
    {
        if (state == in && (c == ' ' || c == '\n' || c == '\t'))
        {
            if (wctr > 9)
                wordlengths[9]++;
            else
                wordlengths[wctr - 1]++;
            wctr = 0;
            state = out;
        }
        if (c == ' ' || c == '\n' || c == '\t')
            state = out;
        else
        {
            state = in;
            ++wctr;
        }
    }
    
    for (i = 0; i < MAXWORDLENGTH-1; i++)
    {
        printf("Characters: %1d (%3d words) ", i+1, wordlengths[i]);
        while (wctr < wordlengths[i])
        {
            printf("#");
            wctr++;
        }
        wctr = 0;
        printf("\n");
    }
    printf("There are %3d word/s that are more than 10 characters\n", wordlengths[MAXWORDLENGTH-1]);
}
